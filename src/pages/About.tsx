import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";

export default function About() {
  const team = [
    {
      name: "김연구",
      role: "Principal Investigator",
      description: "식물 생태학 및 기후 변화 연구",
      image: "🧑‍🔬"
    },
    {
      name: "박데이터",
      role: "Data Scientist",
      description: "PhenoFACT 모델 개발 및 최적화",
      image: "👩‍💻"
    },
    {
      name: "이개발",
      role: "Full-stack Developer", 
      description: "웹 플랫폼 설계 및 구현",
      image: "🧑‍💻"
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "프로젝트 시작",
      description: "PhenoFACT 모델 연구 개시"
    },
    {
      year: "2024",
      title: "모델 개발",
      description: "Chill-Day 모델 v0.9 완성"
    },
    {
      year: "2025",
      title: "플랫폼 런칭",
      description: "꽃피다 웹앱 정식 서비스 시작"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Who We Are?</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          시민과 연구자가 함께 만드는 전국 봄꽃 개화 예측 플랫폼을 구축하는 연구팀입니다.
          과학적 데이터와 사용자 참여를 통해 더 정확한 개화 예측을 목표로 합니다.
        </p>
      </div>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">연구팀</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4">{member.image}</div>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">프로젝트 연혁</h2>
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start mb-8">
              <div className="flex-shrink-0 w-20 text-right mr-6">
                <Badge variant="outline" className="text-sm font-bold">
                  {item.year}
                </Badge>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <Card className="bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-6">
              기후 변화 시대, 시민 과학자들과 함께 만드는<br />
              <strong>정확하고 신뢰할 수 있는 개화 예측 시스템</strong>을 구축하여<br />
              생태계 모니터링과 과학 연구에 기여합니다.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://github.com/phenofact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://phenofact.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span>Research Lab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}